import { useState, useRef, useCallback } from 'react'

const SpeechRecognitionAPI = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null

export default function useSpeechRecognition(onTranscript) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)
  const onTranscriptRef = useRef(onTranscript)
  onTranscriptRef.current = onTranscript
  const supported = !!SpeechRecognitionAPI

  // Create a fresh instance each time — Safari/iOS requires this.
  // Reusing the same SpeechRecognition object after onend fails silently on Safari.
  const createRecognition = useCallback(() => {
    if (!SpeechRecognitionAPI) return null

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (onTranscriptRef.current) onTranscriptRef.current(transcript)
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    recognition.onerror = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    return recognition
  }, [])

  const toggle = useCallback(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      const recognition = createRecognition()
      if (!recognition) return
      recognitionRef.current = recognition
      try {
        recognition.start()
        setIsListening(true)
      } catch {
        setIsListening(false)
        recognitionRef.current = null
      }
    }
  }, [isListening, createRecognition])

  return { isListening, toggle, supported }
}
