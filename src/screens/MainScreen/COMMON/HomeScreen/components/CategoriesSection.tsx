import React from 'react';
import { View, FlatList } from 'react-native';
import Typography from '../../../../../ui/Typography';
import colors from '../../../../../constants/colors';
import Feather from 'react-native-vector-icons/Feather';
import AppImage from '../../../../../ui/AppImage';
import styles from '../styles';

interface Category {
  property_category_id: string;
  property_category_title: string;
  property_category_icon: string;
}

interface CategoriesSectionProps {
  categories: Category[];
  onLayout?: (event: any) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onLayout,
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <View
      style={styles.sectionContainer}
      onLayout={onLayout}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.headingIcon, styles.headingIconPrimary]}>
            <Feather name="grid" size={16} color={colors.mainColor} />
          </View>
          <Typography
            variant="subheading"
            weight="bold"
            color={colors.textDark}
            style={styles.sectionTitle}
          >
            Browse by Category
          </Typography>
        </View>
      </View>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={item => item.property_category_id}
        contentContainerStyle={{ paddingBottom: 15 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            <AppImage
              source={{ uri: item.property_category_icon }}
              style={styles.categoryImage}
            />
            <Typography
              variant="body"
              weight="bold"
              align="center"
              style={{ marginTop: 10 }}
              color={colors.mainColor}
            >
              {item.property_category_title}
            </Typography>
          </View>
        )}
      />
    </View>
  );
};

export default CategoriesSection;

