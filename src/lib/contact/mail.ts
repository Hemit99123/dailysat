export const openMailPopup = (email: string = 'dailysatstaff@gmail.com', subject: string = 'DailySAT Inquiry') => {
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  window.open(mailtoUrl, '_blank');
};

export const copyEmailToClipboard = async (email: string) => {
  try {
    await navigator.clipboard.writeText(email);
    return { success: true, message: 'Email copied to clipboard!' };
  } catch (error) {
    return { success: false, message: 'Failed to copy email to clipboard.' };
  }
}; 