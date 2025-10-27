import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <AlertCircle size={20} />;
            case 'warning':
                return <AlertTriangle size={20} />;
            default:
                return <Info size={20} />;
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'success':
                return 'Sucesso';
            case 'error':
                return 'Erro';
            case 'warning':
                return 'Atenção';
            default:
                return 'Informação';
        }
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">
                {getIcon()}
            </div>
            <div className="toast-content">
                <div className="toast-title">{getTitle()}</div>
                <div className="toast-message">{message}</div>
            </div>
            <button className="toast-close" onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
