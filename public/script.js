const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Array untuk menyimpan riwayat percakapan
let conversationHistory = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Tambahkan pesan pengguna ke UI dan riwayat
  appendMessage('user', userMessage);
  conversationHistory.push({ role: 'user', message: userMessage });
  
  input.value = '';

  // Tampilkan pesan "thinking..." dan ambil elemennya
  const thinkingMessage = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation: conversationHistory }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Hapus pesan "thinking..." dan perbarui dengan respons asli
    thinkingMessage.textContent = result.data;

    // Tambahkan respons bot ke riwayat
    conversationHistory.push({ role: 'model', message: result.data });

  } catch (error) {
    console.error('Error:', error);
    thinkingMessage.textContent = 'Maaf, terjadi kesalahan. Silakan coba lagi.';
    thinkingMessage.classList.add('error');
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Kembalikan elemen pesan agar bisa dimodifikasi
}
