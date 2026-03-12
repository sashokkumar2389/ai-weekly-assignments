import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'error' | 'success' | 'info' | 'warning';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const iconMap = {
    error: <AlertCircle className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
  };

  const colorMap = {
    error: 'bg-red-500/10 border-red-500/20 text-red-300',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300',
  };

  return (
    <div className={`flex gap-3 rounded-full border px-4 py-2 text-sm ${colorMap[type]}`}>
      {iconMap[type]}
      <p>{message}</p>
    </div>
  );
}
