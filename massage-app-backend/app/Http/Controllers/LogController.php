<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function tail(Request $request): JsonResponse
    {
        if (!app()->environment('local')) {
            return response()->json(['message' => 'Log access is disabled.'], 403);
        }

        $lines = (int) $request->query('lines', 200);
        if ($lines < 1) {
            $lines = 1;
        }
        if ($lines > 1000) {
            $lines = 1000;
        }

        $path = storage_path('logs/laravel.log');
        if (!file_exists($path)) {
            return response()->json([
                'lines' => [],
                'lineCount' => 0,
                'requestedLines' => $lines,
                'path' => 'storage/logs/laravel.log',
                'updatedAt' => null,
                'message' => 'Log file not found.',
            ]);
        }

        $linesData = $this->tailFile($path, $lines);
        $updatedAt = @filemtime($path);

        return response()->json([
            'lines' => $linesData,
            'lineCount' => count($linesData),
            'requestedLines' => $lines,
            'path' => 'storage/logs/laravel.log',
            'updatedAt' => $updatedAt ? date('c', $updatedAt) : null,
        ]);
    }

    private function tailFile(string $path, int $lines): array
    {
        $handle = fopen($path, 'rb');
        if ($handle === false) {
            return [];
        }

        $buffer = '';
        $chunkSize = 4096;
        fseek($handle, 0, SEEK_END);
        $position = ftell($handle);

        while ($position > 0 && substr_count($buffer, "\n") <= $lines) {
            $read = $position < $chunkSize ? $position : $chunkSize;
            $position -= $read;
            fseek($handle, $position);
            $chunk = fread($handle, $read);
            if ($chunk === false) {
                break;
            }
            $buffer = $chunk . $buffer;
        }

        fclose($handle);

        $buffer = rtrim($buffer, "\r\n");
        if ($buffer === '') {
            return [];
        }

        $allLines = preg_split("/\r\n|\n|\r/", $buffer);
        if (!$allLines) {
            return [];
        }

        if (count($allLines) > $lines) {
            $allLines = array_slice($allLines, -$lines);
        }

        return $allLines;
    }
}
