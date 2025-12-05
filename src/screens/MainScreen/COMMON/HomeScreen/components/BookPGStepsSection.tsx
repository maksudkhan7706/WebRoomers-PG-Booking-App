import React from 'react';
import { View, ScrollView } from 'react-native';
import Typography from '../../../../../ui/Typography';
import colors from '../../../../../constants/colors';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppButton from '../../../../../ui/AppButton';
import styles from '../styles';
import { steps } from '../../../../../constants/dummyData';

interface BookPGStepsSectionProps {
  onLayout?: (event: any) => void;
}

const BookPGStepsSection: React.FC<BookPGStepsSectionProps> = ({
  onLayout,
}) => {
  return (
    <View
      style={styles.sectionContainer}
      onLayout={onLayout}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.headingIcon, styles.headingIconOrange]}>
            <Feather name="zap" size={16} color="#FF8A4C" />
          </View>
          <Typography
            variant="subheading"
            weight="bold"
            color={colors.textDark}
            style={styles.sectionTitle}
          >
            Book PG in Just 3 Steps
          </Typography>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {steps.map(step => (
          <View key={step.id} style={styles.card}>
            <View style={styles.stepBadgeWrapper}>
              <View style={styles.stepNumberPill}>
                <Typography
                  variant="label"
                  weight="bold"
                  color={colors.white}
                >
                  {step.id}
                </Typography>
              </View>
            </View>
            <View style={styles.stepHeaderRow}>
              <View style={styles.stepIconWrapper}>
                <FontAwesome
                  name={step.icon}
                  size={20}
                  color={colors.mainColor}
                />
              </View>
              <Typography
                variant="body"
                weight="bold"
                color={colors.textDark}
                style={styles.stepTitle}
              >
                {step.title}
              </Typography>
            </View>

            <Typography
              variant="label"
              color={colors.gray}
              style={styles.stepDesc}
            >
              {step.desc}
            </Typography>

            <AppButton
              title={step.btnText}
              onPress={() => console.log(`${step.btnText} clicked`)}
              style={styles.stepButton}
              titleSize="label"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BookPGStepsSection;

