import { BotBubble } from './BotBubble';

export function WelcomeMessage() {
    const now = new Date();

    return (
        <BotBubble timestamp={now}>
            <div className="space-y-3">
                <p className="font-semibold text-text-primary">
                    Welcome to RecruitBot! 👋
                </p>
                <p className="text-text-muted">
                    I help you discover top candidates quickly using three powerful search methods:
                </p>
                <ul className="space-y-2 text-xs">
                    <li className="flex gap-2">
                        <span className="text-primary">🔍</span>
                        <span>
                            <strong>Vector Search:</strong> Semantic similarity using AI embeddings
                        </span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-score-bm25">📝</span>
                        <span>
                            <strong>BM25 Keyword:</strong> Precise keyword and phrase matching
                        </span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-score-hybrid">⚡</span>
                        <span>
                            <strong>Hybrid:</strong> Combined results with customizable weights
                        </span>
                    </li>
                </ul>
                <p className="text-text-muted text-xs">
                    Try a query below or use one of the suggestions!
                </p>
            </div>
        </BotBubble>
    );
}
