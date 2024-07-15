import { useState } from 'react'
import { Stack, TextField,CommandBarButton } from '@fluentui/react'
import { SendRegular } from '@fluentui/react-icons'

import Send from '../../assets/Send.svg'

import styles from './QuestionInput.module.css'

interface Props {
  onSend: (question: string, id?: string) => void
  onFeedbackSend: (question: string, id?: string, pmid?: string) => void
  disabled: boolean
  placeholder?: string
  clearOnSend?: boolean
  conversationId?: string
}

export const QuestionInput = ({ onSend, onFeedbackSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
  const [question, setQuestion] = useState<string>('')
  const [lastMessageId, setLastMessageId] = useState<string | undefined>(conversationId);

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return
    }

    if (conversationId) {
      onSend(question, conversationId)
    } else {
      onSend(question)
    }

    if (clearOnSend) {
      setQuestion('')
    }
  }

  const sendFeedback = async () => {
    if (disabled || !question.trim()) {
      return;
    }

    const feedbackMessage = `This is a direct follow-up to your last message. Classify the sentiment, and end your message with the classification. \n\n${question}`;
    
    if (lastMessageId) {
      console.log(`Sending feedback with last message ID: ${lastMessageId}`);
      await onFeedbackSend(feedbackMessage, lastMessageId);
    } else {
      console.log('Sending feedback without a last message ID');
      await onFeedbackSend(feedbackMessage);
    }

    if (clearOnSend) {
      setQuestion('');
    }
  };

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault()
      sendQuestion()
    }
  }

  const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setQuestion(newValue || '')
  }

  const sendQuestionDisabled = disabled || !question.trim()

  return (
    <Stack horizontal className={styles.questionInputContainer}>
      <TextField
        className={styles.questionInputTextArea}
        placeholder={placeholder}
        multiline
        resizable={false}
        borderless
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onEnterPress}
      />
      <Stack verticalAlign="start" styles={{ root: { display: 'flex', flexDirection: 'column' } }}>
        {/* <div
          className={styles.correctionButton}
          role="button"
          tabIndex={0}
          aria-label="Submit correction button"
          
          onClick={sendFeedback}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? sendFeedback() : null)}>
          {sendQuestionDisabled ? (
            <span>Provide Feedback (Disabled)</span>
          ) : (
            <span>Provide Feedback</span>
          )}
        </div> */}
        <div
          className={styles.questionInputSendButtonContainer}
          role="button"
          tabIndex={0}
          aria-label="Ask question button"
          onClick={sendQuestion}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? sendQuestion() : null)}>
          {sendQuestionDisabled ? (
            <SendRegular className={styles.questionInputSendButtonDisabled} />
          ) : (
            <img src={Send} className={styles.questionInputSendButton} alt="Send Button" />
          )}
        </div>
      </Stack>
      <div className={styles.questionInputBottomBorder} />
    </Stack>
  )
}
