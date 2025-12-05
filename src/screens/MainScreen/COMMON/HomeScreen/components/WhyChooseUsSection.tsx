import React from 'react';
import { View, ScrollView } from 'react-native';
import Typography from '../../../../../ui/Typography';
import colors from '../../../../../constants/colors';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles';
import { whyChooseUs } from '../../../../../constants/dummyData';

const WhyChooseUsSection: React.FC = () => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.headingIcon, styles.headingIconPurple]}>
            <Feather name="award" size={16} color="#7C4DFF" />
          </View>
          <Typography
            variant="subheading"
            weight="bold"
            color={colors.textDark}
            style={styles.sectionTitle}
          >
            Why Choose Us
          </Typography>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {whyChooseUs.map((item, index) => (
          <View key={index} style={styles.whyCard}>
            <Typography
              variant="body"
              weight="bold"
              color={colors.textDark}
              style={styles.whyTitle}
            >
              {item.title}
            </Typography>
            <Typography variant="label" color={colors.gray}>
              {item.desc}
            </Typography>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default WhyChooseUsSection;

