import React, { useState, useRef } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import Typography from '../../../../../ui/Typography';
import colors from '../../../../../constants/colors';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 80;
const SPACING = 14;

interface Review {
  review_id: string;
  review_text: string;
  name: string;
  company_name: string;
  role: string;
}

interface DashboardReviewsSectionProps {
  reviews: Review[];
  onLayout?: (event: any) => void;
}

const DashboardReviewsSection: React.FC<DashboardReviewsSectionProps> = ({
  reviews,
  onLayout,
}) => {
  const flatListRef = useRef<FlatList | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviewsRenderItem = ({ item, index }: { item: Review; index: number }) => {
    return (
      <View
        style={[
          styles.reviewCard,
          {
            width: ITEM_WIDTH,
            marginRight: index === reviews?.length - 1 ? 0 : SPACING,
          },
        ]}
      >
        <Typography
          variant="body"
          color="#333"
          style={{
            marginBottom: 20,
            lineHeight: 22,
          }}
        >
          {item.review_text}
        </Typography>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome
            style={{
              marginRight: 12,
            }}
            name="user-circle-o"
            size={30}
            color={colors.mainColor}
          />
          <View style={{ width: '88%' }}>
            <Typography style={{ fontWeight: 'bold', color: '#3A3A3A' }}>
              {item.name}
            </Typography>
            <Typography style={{ color: '#666' }}>
              {item.company_name} - {item.role}
            </Typography>
          </View>
        </View>
      </View>
    );
  };

  if (!reviews || reviews.length <= 0) {
    return null;
  }

  return (
    <View
      style={styles.sectionContainer}
      onLayout={onLayout}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.headingIcon, styles.headingIconAmber]}>
            <Feather name="message-circle" size={16} color="#FFB74D" />
          </View>
          <Typography
            variant="subheading"
            weight="bold"
            color={colors.textDark}
            style={[styles.sectionTitle, { marginBottom: 5 }]}
          >
            Customer Reviews
          </Typography>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={reviews}
        renderItem={reviewsRenderItem}
        snapToInterval={ITEM_WIDTH + SPACING}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.review_id}
        onMomentumScrollEnd={event => {
          const newIndex = Math.min(
            Math.max(
              Math.round(
                event.nativeEvent.contentOffset.x / (ITEM_WIDTH + SPACING),
              ),
              0,
            ),
            reviews?.length > 0 ? reviews.length - 1 : 0,
          );
          setCurrentIndex(newIndex);
        }}
        contentContainerStyle={{
          paddingLeft: 0,
          paddingRight: (width - ITEM_WIDTH) / 2,
        }}
      />
      <View style={styles.paginationDots}>
        {reviews.map((item: Review, index: number) => (
          <View
            key={item?.review_id ?? index.toString()}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default DashboardReviewsSection;

