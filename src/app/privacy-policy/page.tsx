import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="text-blue-900 p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-200">
        <h1 className="text-3xl font-bold text-blue-500 mb-4">Privacy Policy</h1>
        <p className="mb-4">
          Your privacy is important to us. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you visit our website.
        </p>
        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Information We Collect</h2>
        <p className="mb-4">
          We may collect personal information such as your name, email address, and usage data
          to improve our services.
        </p>
        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">How We Use Information</h2>
        <p className="mb-4">
          The information we collect is used to operate and improve our services, communicate with
          users, and ensure a secure experience.
        </p>
        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at support@example.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
