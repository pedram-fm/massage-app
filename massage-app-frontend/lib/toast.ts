/**
 * Simple toast utility using browser notifications
 * Can be replaced with a proper toast library like sonner or react-hot-toast
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

class ToastManager {
  private toasts: Map<string, HTMLDivElement> = new Map();
  private container: HTMLDivElement | null = null;

  private ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        pointer-events: none;
        max-width: 420px;
        width: 100%;
        padding: 0 1rem;
      `;
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  private show(type: ToastType, message: string, options: ToastOptions = {}) {
    const container = this.ensureContainer();
    const id = `toast-${Date.now()}-${Math.random()}`;
    const duration = options.duration || 3000;

    const toast = document.createElement('div');
    toast.id = id;
    toast.style.cssText = `
      background: white;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      border: 1px solid #e5e7eb;
      pointer-events: auto;
      animation: slideIn 0.2s ease-out;
      direction: rtl;
      ${type === 'error' ? 'border-right: 4px solid #ef4444;' : ''}
      ${type === 'success' ? 'border-right: 4px solid #10b981;' : ''}
      ${type === 'warning' ? 'border-right: 4px solid #f59e0b;' : ''}
      ${type === 'info' ? 'border-right: 4px solid #3b82f6;' : ''}
    `;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };

    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };

    toast.innerHTML = `
      <div style="display: flex; align-items: start; gap: 0.75rem;">
        <div style="
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: ${colors[type]}20;
          color: ${colors[type]};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        ">${icons[type]}</div>
        <div style="flex: 1; font-size: 0.875rem;">
          ${options.title ? `<div style="font-weight: 600; margin-bottom: 0.25rem;">${options.title}</div>` : ''}
          <div style="color: #6b7280;">${message}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          font-size: 1.25rem;
          line-height: 1;
          flex-shrink: 0;
        ">×</button>
      </div>
    `;

    container.appendChild(toast);
    this.toasts.set(id, toast);

    // Auto dismiss
    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  private dismiss(id: string) {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.style.animation = 'slideOut 0.2s ease-in';
      setTimeout(() => {
        toast.remove();
        this.toasts.delete(id);
      }, 200);
    }
  }

  success(message: string, options?: ToastOptions) {
    this.show('success', message, options);
  }

  error(message: string, options?: ToastOptions) {
    this.show('error', message, options);
  }

  warning(message: string, options?: ToastOptions) {
    this.show('warning', message, options);
  }

  info(message: string, options?: ToastOptions) {
    this.show('info', message, options);
  }
}

// Add animations via style tag
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export const toast = new ToastManager();
