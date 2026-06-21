import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase, type Question, type Category } from '@/lib/supabase';
import { ChevronLeft, Clock, CheckCircle, XCircle } from 'lucide-react-native';

const QUESTION_TIME = 20;
const QUESTIONS_PER_QUIZ = 10;

export default function QuizScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timer, setTimer] = useState(QUESTION_TIME);
  const [showNameModal, setShowNameModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showReference, setShowReference] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; question: string; selected: number; correctAnswer: number; reference: string | null }[]>([]);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    fetchQuestions();
  }, [categoryId]);

  useEffect(() => {
    if (timer > 0 && !selectedAnswer && !quizFinished && !loading) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !selectedAnswer && !quizFinished) {
      handleAnswer(-1);
    }
  }, [timer, selectedAnswer, quizFinished, loading]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const fetchQuestions = async () => {
    try {
      let query = supabase
        .from('questions')
        .select('*');
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data: qData, error: qError } = await query;
      if (qError) throw qError;
      
      const shuffled = (qData || []).sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, QUESTIONS_PER_QUIZ);
      setQuestions(selected);

      if (categoryId) {
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single();
        setCategory(catData);
      }
    } catch (err) {
      setError('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = answerIndex === currentQuestion.correct_answer;
    
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    const newAnswer = {
      correct: isCorrect,
      question: currentQuestion.question,
      selected: answerIndex,
      correctAnswer: currentQuestion.correct_answer,
      reference: currentQuestion.reference,
    };
    setAnswers(prev => [...prev, newAnswer]);
    
    setSelectedAnswer(answerIndex);
    setShowReference(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setTimer(QUESTION_TIME);
      setShowReference(false);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    } else {
      setQuizFinished(true);
      setShowNameModal(true);
    }
  };

  const handleSaveScore = async () => {
    const name = playerName.trim() || 'Anonymous';
    try {
      await supabase.from('leaderboard').insert({
        player_name: name,
        score: score * 10,
        category_id: categoryId || null,
        total_questions: questions.length,
        correct_answers: score,
      });
      setShowNameModal(false);
      router.replace('/leaderboard');
    } catch (err) {
      setShowNameModal(false);
    }
  };

  const handleQuit = () => {
    Alert.alert(
      'Quit Quiz?',
      'Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchQuestions} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (quizFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{score * 10}</Text>
            <Text style={styles.scoreLabel}>points</Text>
          </View>
          <Text style={styles.resultSubtitle}>
            You got {score} out of {questions.length} correct
          </Text>
          
          <View style={styles.answersReview}>
            {answers.map((ans, idx) => (
              <View key={idx} style={styles.reviewRow}>
                {ans.correct ? (
                  <CheckCircle color="#10B981" size={20} style={styles.reviewIcon} />
                ) : (
                  <XCircle color="#EF4444" size={20} style={styles.reviewIcon} />
                )}
                <View style={styles.reviewText}>
                  <Text style={styles.reviewQuestion} numberOfLines={1}>{ans.question}</Text>
                  <Text style={styles.reviewReference}>{ans.reference}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Modal visible={showNameModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Your Name</Text>
              <TextInput
                style={styles.nameInput}
                placeholder="Your name"
                placeholderTextColor="#94A3B8"
                value={playerName}
                onChangeText={setPlayerName}
                autoFocus
                maxLength={30}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveScore}>
                <Text style={styles.saveButtonText}>Save Score</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => {
                  setShowNameModal(false);
                  router.back();
                }}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {!showNameModal && (
          <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
            <Text style={styles.doneButtonText}>Back to Home</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit} style={styles.backButton}>
          <ChevronLeft color="#1E293B" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {category?.name || 'Random Quiz'}
        </Text>
        <View style={styles.timerBadge}>
          <Clock color={timer <= 5 ? '#EF4444' : '#3B82F6'} size={16} />
          <Text style={[styles.timerText, timer <= 5 && styles.timerWarning]}>
            {timer}s
          </Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>
        Question {currentIndex + 1} of {questions.length}
      </Text>

      <Animated.View
        style={[
          styles.questionContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correct_answer;
          const optionStyle: any[] = [styles.optionButton];
          const optionTextStyle: any[] = [styles.optionText];

          if (selectedAnswer !== null) {
            if (isCorrect) {
              optionStyle.push(styles.optionCorrect);
              optionTextStyle.push(styles.optionTextCorrect);
            } else if (isSelected) {
              optionStyle.push(styles.optionWrong);
              optionTextStyle.push(styles.optionTextWrong);
            } else {
              optionStyle.push(styles.optionDisabled);
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={optionStyle}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}>
              <Text style={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </Text>
              <Text style={optionTextStyle}>{option}</Text>
            </TouchableOpacity>
          );
        })}

        {showReference && currentQuestion.reference && (
          <View style={styles.referenceBox}>
            <Text style={styles.referenceText}>{currentQuestion.reference}</Text>
          </View>
        )}

        {selectedAnswer !== null && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 4,
  },
  timerWarning: {
    color: '#EF4444',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 16,
  },
  questionText: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#1E293B',
    marginBottom: 24,
    lineHeight: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionDisabled: {
    opacity: 0.6,
  },
  optionLetter: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#3B82F6',
    marginRight: 12,
    width: 24,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#1E293B',
    flex: 1,
  },
  optionTextCorrect: {
    color: '#10B981',
  },
  optionTextWrong: {
    color: '#EF4444',
  },
  referenceBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  referenceText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#3B82F6',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  resultTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1E293B',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 40,
    color: 'white',
  },
  scoreLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  resultSubtitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  answersReview: {
    width: '100%',
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  reviewIcon: {
    marginRight: 12,
  },
  reviewText: {
    flex: 1,
  },
  reviewQuestion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E293B',
  },
  reviewReference: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  doneButton: {
    backgroundColor: '#1E293B',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  nameInput: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
  },
  skipButton: {
    padding: 14,
    alignItems: 'center',
  },
  skipButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#94A3B8',
  },
});
