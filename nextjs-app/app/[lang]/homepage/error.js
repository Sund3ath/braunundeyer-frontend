'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h2 className="text-2xl font-heading font-light text-primary mb-4">
          Something went wrong!
        </h2>
        <p className="text-text-secondary mb-6">
          {error?.message || 'Failed to load the homepage'}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-accent text-black rounded hover:bg-accent/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}