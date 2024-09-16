import sherpa_onnx from "sherpa-onnx";

// Copyright (c)  2023-2024  Xiaomi Corporation (authors: Fangjun Kuang)



for (let i = 0; i < 10; i++) {
    const audio = tts.generate({
        text:
            '“Today as always, men fall into two groups: slaves and free men. Whoever does not have two-thirds of his day for himself, is a slave, whatever he may be: a statesman, a businessman, an official, or a scholar.”',
        sid: 0,
        speed: 1
      });
      
      tts.save('./' + Date.now() + '.wav', audio);
      tts.free();
}


console.log('Saved to test-en.wav successfully.');

