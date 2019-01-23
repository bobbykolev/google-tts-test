const tts = async function (fileName) {
    const textToSpeech = require('@google-cloud/text-to-speech');
    const fs = require('fs');
    const util = require('util');

    const client = new textToSpeech.TextToSpeechClient();

    const input = fileName ? fileName + '.txt' : 'input.txt';
    const outputFile = 'output.mp3';

    const readFile = util.promisify(fs.readFile);
    const text = await readFile(input);

    const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3' },
    };
    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(outputFile, response.audioContent, 'binary');
    console.log(`Audio content written to file: ${outputFile}`);
}

tts(process.argv[2]);