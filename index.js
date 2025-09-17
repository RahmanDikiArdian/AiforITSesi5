import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";
import { text } from "body-parser";


const app = express();
const upload = multer();
const ai = new GoogleGenAI({});

// init ai
const geminiAI = {
  text : "gemini-2.5-flash-lite",
  model: "gemini-2.5-flash",
  Image: "gemini-2.5-flash",
  document: "gemini-2.5-flash-lite",
  
}

//init app backend
app.use(cors());
app.use(express.json()); // -> untuk mengizinkan mengunakan 'Conten-type: application/json' di header
app.use(express.urlencoded({ extended: true }));

// inisiasi route (app sub funcion):
// .get(), .post(),.put(), .patch(), .delete(). -> yg umum di pakai
app.post('/generate-text',async(req,res)=>{
    //handle request yg diterima user
    const {body} = req;

    // guard clausa
    if(!body){
        res.status(400).send("tidak ada yg terkirim");
        return;

        
    }

    if(typeof body !== 'object'){
        res.status(400).send("tidak sesuai format");
        return;

    }

    const {massage} = body;
    
    if(!massage || typeof massage !== 'string'){
        res.status(400).send("tidak ada pesan atau foramt tidak sesuai");
        return;

    }

    const response = await ai.models.generateContent({
        contents: massage,
        model: geminiModels.text
    });
    res.status(200).json({
        reply: response.text
    });



});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "buatkan saya website berisi html, css, dan javascript, dan untuk stylnya menggunakan tailwind css",
//   });
//   console.log(response.text);
// }

// await main();
// panggil si app-nya di sini
const port = 3000;

app.listen(port, () => {
    console.log("I LOVE YOU", port);
});