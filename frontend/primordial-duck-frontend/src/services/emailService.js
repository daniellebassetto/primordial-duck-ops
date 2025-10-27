import emailjs from '@emailjs/browser';

const emailService = {
    sendPasswordResetEmail: async (email, temporaryPassword) => {
        try {
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (!serviceId || !templateId || !publicKey) {
                throw new Error('Configuração do EmailJS não encontrada. Configure as variáveis de ambiente.');
            }

            const templateParams = {
                to_email: email,
                temporary_password: temporaryPassword,
            };

            const response = await emailjs.send(
                serviceId,
                templateId,
                templateParams,
                publicKey
            );

            return response;
        } catch (error) {
            console.error('Erro detalhado ao enviar e-mail:', {
                message: error.message,
                text: error.text,
                status: error.status,
                error: error
            });
            throw error;
        }
    }
};

export default emailService;
