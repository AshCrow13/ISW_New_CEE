import feedback from '@hooks/feedback/feedback';

const Feedback = () => {
    const { feedbacks, loading, fetchFeedbacks } = feedback();

    return (
        <div>
            <h1>Feedbacks</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {feedbacks.map((feedback) => (
                        <li key={feedback.id}>{feedback.message}</li>
                    ))}
                </ul>
            )}
            <button onClick={fetchFeedbacks}>Refresh Feedbacks</button>
        </div>
    );
}

export default Feedback;