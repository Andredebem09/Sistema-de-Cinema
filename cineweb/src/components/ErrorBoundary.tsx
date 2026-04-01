import React from "react";

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
    message?: string;
};

export default class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: unknown): State {
        return {
            hasError: true,
            message: error instanceof Error ? error.message : "Erro inesperado.",
        };
    }

    componentDidCatch(error: unknown) {
        console.error("Erro de renderização:", error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container py-4">
                    <div className="alert alert-danger">
                        Falha ao carregar a aplicação. {this.state.message}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
