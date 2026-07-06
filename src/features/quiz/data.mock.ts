import type { QuizData } from "./types";

// Mock Data
export const quiz1: QuizData = {
  id:1,
  title: "Minat Bakat",
  startTime: "06/07/2026 10:00", // Nanti ganti jadi datetime
  endTime: "06/07/2026 12:00", // Nanti ganti jadi datetime
  questions: [
    // Tipe Soal: Pilihan Ganda
    {
      id: 1,
      question_number: 1, // dipakai hanya jika guru ingin soalnya diurutkan
      type: "pilihan_ganda",
      question:
        "Berapakah hasil penjumlahan dari 1 ditambah 1? Silahkan pilih salah satu jawaban berikut:",
      options: [
        {
          id: 1,
          label: "Satu",
        },
        {
          id: 2,
          label: "Dua",
        },
        {
          id: 3,
          label: "Ungu",
        },
        {
          id: 4,
          label: "Empat",
        },
        {
          id: 5,
          label: "Bebek",
        },
      ],
      answer: [1],
    },

    // Tipe Soal: Pilihan Ganda Kompleks
    {
      id: 2,
      question_number: 2,
      type: "pilihan_ganda_kompleks",
      question:
        "Dari pilihan berikut, manakah hewan yang memiliki 4 kaki? (Pilih 3)",
      options: [
        {
          id: 1,
          label: "Kuda",
        },
        {
          id: 2,
          label: "Ayam",
        },
        {
          id: 3,
          label: "Rusa",
        },
        {
          id: 4,
          label: "Kucing",
        },
        {
          id: 5,
          label: "Bebek",
        },
      ],
      answer: [1, 3, 4],
    },

    // Tipe Soal: Range Value
    {
      id: 3,
      question_number: 3,
      type: "rentang_nilai",
      question: "Seberapa suka kamu dengan aplikasi ini?",
      min_val: 1,
      max_val: 9,
      min_val_label: "Sangat Tidak Suka", // Opsional
      max_val_label: "Sangat Suka", // Opsional
    },

    // Tipe Soal: True or False
    // Note: Kalau questions.length == 1, buat styling sama kaya pilihan ganda
    // Note: Kalau questions.length > 1, buat styling pakai table
    {
      id: 4,
      question_number: 4,
      type: "benar_salah",
      question: "Tentukan benar atau salah pada pernyataan di tabel berikut!",
      question_table: [
        { id: 1, question: "Bebek kakinya 2", answer: true },
        {
          id: 2,
          question: "Indonesia merdeka pada tanggal 17 Agustus 1945",
          answer: true,
        },
        { id: 3, question: "Cewek selalu benar", answer: false },
        {
          id: 4,
          question: "Lampu merah artinya masih boleh jalan kalau jalan sepi",
          answer: false,
        },
      ],
    },

    // Tipe Soal: Essay
    {
      id: 5,
      question_number: 5,
      type: "essay",
      question:
        "Berapakah hasil pembagian 25 x 10 / 5, jawab dengan angka saja! Sertakan caranya difoto!",
      // answer_reference ini opsional, namun bisa menjadi 'patokan pengingat'
      // untuk guru waktu mengoreksi jawaban siswanya.
      answer_reference: "Jawabannya adalah 50, bebas pakai cara apa.",
    },
  ],
};

export const quizList: QuizData[] = [quiz1];
