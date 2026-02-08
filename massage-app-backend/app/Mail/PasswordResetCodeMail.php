<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(private readonly string $code)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'کد بازیابی رمز عبور - ماساژ اپ',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.auth.password-reset-code',
            with: [
                'code' => $this->code,
            ],
        );
    }
}
