import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase, type Category } from '@/lib/supabase';
import { Scroll, BookOpen, Cross, Church } from 'lucide-react-native';

const iconMap: Record<string, React.ReactNode> = {
  scroll: <Scroll color="white" size={28} />,
  'book-open': <BookOpen color="white" size={28} />,
  cross: <Cross color="white" size={28} />,
  church: <Church color="white" size={28} />,
};

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError('Failed to load quiz categories');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (categoryId: string) => {
    router.push(`/quiz?categoryId=${categoryId}`);
  };

  const handleRandomQuiz = () => {
    router.push('/quiz');
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
        <TouchableOpacity onPress={fetchCategories} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Bible Quiz</Text>
          <Text style={styles.subtitle}>Test your knowledge of Scripture</Text>
        </View>

        <TouchableOpacity
          style={styles.randomButton}
          onPress={handleRandomQuiz}>
          <Text style={styles.randomButtonText}>Random Quiz</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Choose a Category</Text>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryCard,
              { backgroundColor: cat.color || '#3B82F6' },
            ]}
            onPress={() => handleStartQuiz(cat.id)}>
            <View style={styles.categoryIcon}>
              {iconMap[cat.icon || 'book-open'] || (
                <BookOpen color="white" size={28} />
              )}
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryDesc}>{cat.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  randomButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  randomButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 4,
  },
  categoryDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
});
