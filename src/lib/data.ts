export interface Item {
  id: string;
  name: string;
}

// Generic example data - in a real app this would come from an API
export const items: Item[] = [
  { id: "user_active", name: "User is Active" },
  { id: "email_verified", name: "Email Verified" },
  { id: "profile_complete", name: "Profile Complete" },
  { id: "subscription_active", name: "Subscription Active" },
  { id: "premium_member", name: "Premium Member" },
  { id: "location_enabled", name: "Location Enabled" },
  { id: "notifications_enabled", name: "Notifications Enabled" },
  { id: "two_factor_auth_enabled", name: "Two-Factor Auth Enabled" },
  { id: "marketing_opt_in", name: "Marketing Opt-In" },
  { id: "terms_accepted", name: "Terms Accepted" },
  { id: "age_verified", name: "Age Verified" },
  { id: "phone_number_verified", name: "Phone Number Verified" },
  { id: "account_is_business", name: "Account is Business" },
  { id: "onboarding_complete", name: "Has Completed Onboarding" },
  { id: "is_content_creator", name: "Is Content Creator" },
  { id: "has_made_purchase", name: "Has Made a Purchase" },
  { id: "has_referral_code", name: "Has Referral Code" },
  { id: "beta_program_member", name: "Beta Program Member" },
  { id: "newsletter_subscriber", name: "Newsletter Subscriber" },
  { id: "community_contributor", name: "Community Contributor" },
];
