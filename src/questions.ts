import { Question } from "./types";

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'twk-1',
    category: 'TWK',
    subCategory: 'Pancasila',
    text: 'Pancasila sebagai dasar negara Indonesia secara konstitusional tercantum dalam...',
    options: [
      { id: 'a', text: 'Pembukaan UUD 1945 alinea keempat' },
      { id: 'b', text: 'Batang Tubuh UUD 1945' },
      { id: 'c', text: 'Ketentuan Penutup UUD 1945' },
      { id: 'd', text: 'Piagam Jakarta' },
      { id: 'e', text: 'Dekrit Presiden 5 Juli 1959' }
    ],
    correctAnswerId: 'a',
    explanation: 'Dasar negara Pancasila tercantum secara sah dan konstitusional dalam alinea keempat Pembukaan UUD 1945.'
  },
  {
    id: 'tiu-1',
    category: 'TIU',
    subCategory: 'Logika Numerik',
    text: 'Jika 3x + 5 = 20, maka nilai x adalah...',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
      { id: 'd', text: '6' },
      { id: 'e', text: '7' }
    ],
    correctAnswerId: 'c',
    explanation: '3x + 5 = 20 => 3x = 15 => x = 5.'
  },
  {
    id: 'tkp-1',
    category: 'TKP',
    subCategory: 'Pelayanan Publik',
    text: 'Seorang pelanggan mengeluh dengan nada marah tentang layanan yang ia terima. Sikap Anda adalah...',
    options: [
      { id: 'a', text: 'Meminta maaf dan segera memperbaiki kesalahan layanan tersebut', score: 5 },
      { id: 'b', text: 'Mendengarkan dengan sabar dan melaporkan ke atasan', score: 4 },
      { id: 'c', text: 'Menjelaskan prosedur perusahaan dengan tenang', score: 3 },
      { id: 'd', text: 'Membiarkan ia bicara sampai tenang baru menanggapi', score: 2 },
      { id: 'e', text: 'Menyuruhnya tenang karena kemarahannya mengganggu pelanggan lain', score: 1 }
    ],
    explanation: 'Dalam pelayanan publik, respons cepat dan permintaan maaf adalah prioritas utama untuk meredam kemarahan pelanggan.'
  }
];
