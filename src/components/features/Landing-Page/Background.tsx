import React from 'react';

const Background = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-300 opacity-30 filter blur-3xl animate-blob"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-indigo-300 opacity-20 filter blur-3xl animate-blob"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute -bottom-32 left-1/2 w-96 h-96 rounded-full bg-purple-300 opacity-25 filter blur-2xl animate-blob"
        style={{ animationDelay: '4s' }}
      />
    </div>
  );
};

export default Background;

