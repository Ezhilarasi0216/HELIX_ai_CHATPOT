import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

interface EmotionDetectionResult {
   emotion: string;
   confidence: number;
   isNegative: boolean;
   timestamp: Date;
}

export const useFaceEmotionDetection = (enabled: boolean = false) => {
   const [isLoading, setIsLoading] = useState(true);
   const [currentEmotion, setCurrentEmotion] = useState<EmotionDetectionResult | null>(null);
   const [negativeEmotionDuration, setNegativeEmotionDuration] = useState(0);
   const videoRef = useRef<HTMLVideoElement | null>(null);
   const streamRef = useRef<MediaStream | null>(null);
   const intervalRef = useRef<NodeJS.Timeout | null>(null);
   const negativeStartRef = useRef<Date | null>(null);

   useEffect(() => {
      if (!enabled) {
         cleanup();
         return;
      }

      loadModels();
      return cleanup;
   }, [enabled]);

   const loadModels = async () => {
      try {
         const MODEL_URL = '/models'; // You'll need to add face-api.js models to public/models

         await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
         ]);

         setIsLoading(false);
         startVideo();
      } catch (error) {
         console.error('Error loading face detection models:', error);
         setIsLoading(false);
      }
   };

   const startVideo = async () => {
      try {
         console.log('🎥 Starting camera for face emotion detection...');
         const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
         });

         streamRef.current = stream;
         console.log('✅ Camera stream obtained successfully');

         if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            console.log('✅ Video element playing');
         }

         // Start emotion detection every 3 seconds
         intervalRef.current = setInterval(detectEmotion, 3000);
         console.log('✅ Face emotion detection started (checking every 3 seconds)');
      } catch (error) {
         console.error('❌ Error accessing camera:', error);
      }
   };

   const detectEmotion = async () => {
      if (!videoRef.current) return;

      try {
         const detections = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

         if (detections && detections.expressions) {
            const expressions = detections.expressions;

            // Get dominant emotion
            const emotions = Object.entries(expressions);
            const [dominantEmotion, confidence] = emotions.reduce((prev, curr) =>
               curr[1] > prev[1] ? curr : prev
            );

            // Check if emotion is negative
            const negativeEmotions = ['sad', 'angry', 'fearful', 'disgusted'];
            const isNegative = negativeEmotions.includes(dominantEmotion);

            const result: EmotionDetectionResult = {
               emotion: dominantEmotion,
               confidence,
               isNegative,
               timestamp: new Date()
            };

            setCurrentEmotion(result);

            // Track negative emotion duration
            if (isNegative) {
               if (!negativeStartRef.current) {
                  negativeStartRef.current = new Date();
               } else {
                  const duration = (new Date().getTime() - negativeStartRef.current.getTime()) / 1000;
                  setNegativeEmotionDuration(duration);
               }
            } else {
               negativeStartRef.current = null;
               setNegativeEmotionDuration(0);
            }
         }
      } catch (error) {
         console.error('Error detecting emotion:', error);
      }
   };

   const cleanup = () => {
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
         streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
         videoRef.current.srcObject = null;
      }
      setCurrentEmotion(null);
      setNegativeEmotionDuration(0);
      negativeStartRef.current = null;
   };

   return {
      videoRef,
      isLoading,
      currentEmotion,
      negativeEmotionDuration,
      shouldTriggerCrisis: negativeEmotionDuration > 60 // Trigger after 60 seconds (1 minute) of negative emotion
   };
};
