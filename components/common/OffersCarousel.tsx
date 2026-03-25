import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '@/constants/colors';

interface Offer {
  id: string | number;
  title: string;
  description: string;
  discount: number;
  badge?: string;
  onTap?: () => void;
}

interface OffersCarouselProps {
  offers: Offer[];
  onOfferPress?: (offerId: string | number) => void;
}

export default function OffersCarousel({ offers, onOfferPress }: OffersCarouselProps) {
  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ofertas Especiales</Text>
        <MaterialIcons name="local-offer" size={20} color={COLORS.warning} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {offers.map((offer) => (
          <TouchableOpacity
            key={offer.id}
            style={styles.offerCard}
            onPress={() => {
              if (onOfferPress) {
                onOfferPress(offer.id);
              }
              if (offer.onTap) {
                offer.onTap();
              }
            }}
          >
            {/* Discount Badge */}
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{offer.discount}%</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.offerTitle} numberOfLines={2}>
                {offer.title}
              </Text>
              <Text style={styles.offerDescription} numberOfLines={2}>
                {offer.description}
              </Text>

              {offer.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{offer.badge}</Text>
                </View>
              )}
            </View>

            {/* Arrow */}
            <View style={styles.arrow}>
              <MaterialIcons name="chevron-right" size={24} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.dark,
  },
  carousel: {
    paddingHorizontal: SPACING.md,
  },
  offerCard: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    width: 280,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  discountBadge: {
    // Left side - badge
    backgroundColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  discountText: {
    color: 'white',
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.sm,
  },
  content: {
    flex: 1,
    gap: SPACING.xs,
  },
  offerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.dark,
  },
  offerDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  badge: {
    backgroundColor: COLORS.light,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primary,
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
