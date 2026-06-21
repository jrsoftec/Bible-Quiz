import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { supabase, type LeaderboardEntry } from '@/lib/supabase';
import { Trophy, Medal, Award } from 'lucide-react-native';

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*, categories(name)')
        .order('score', { ascending: false })
        .limit(50);
      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy color="#F59E0B" size={24} />;
    if (index === 1) return <Medal color="#9CA3AF" size={24} />;
    if (index === 2) return <Award color="#B45309" size={24} />;
    return null;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return '#FEF3C7';
    if (index === 1) return '#F3F4F6';
    if (index === 2) return '#FEF9C3';
    return '#FFFFFF';
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntry;
    index: number;
  }) => (
    <View
      style={[
        styles.entryRow,
        { backgroundColor: getRankColor(index) },
      ]}>
      <View style={styles.rankColumn}>
        {getRankIcon(index) || (
          <Text style={styles.rankText}>{index + 1}</Text>
        )}
      </View>
      <View style={styles.nameColumn}>
        <Text style={styles.playerName}>{item.player_name}</Text>
        <Text style={styles.categoryName}>
          {item.categories?.name || 'Random Quiz'}
        </Text>
      </View>
      <View style={styles.scoreColumn}>
        <Text style={styles.scoreText}>{item.score}</Text>
        <Text style={styles.answersText}>
          {item.correct_answers}/{item.total_questions}
        </Text>
      </View>
    </View>
  );

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
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top scores from all players</Text>
      </View>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No scores yet. Play a quiz!</Text>
          </View>
        }
      />
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
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  rankColumn: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#64748B',
  },
  nameColumn: {
    flex: 1,
    paddingHorizontal: 12,
  },
  playerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1E293B',
  },
  categoryName: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  scoreColumn: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#3B82F6',
  },
  answersText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#94A3B8',
  },
});
