import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeScreen } from './screens/HomeScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { AddVehicleScreen } from './screens/AddVehicleScreen';
import { AddSparePartsScreen } from './screens/AddSparePartsScreen';
import { ContactDetailsScreen } from './screens/ContactDetailsScreen';
import { ReviewInquiryScreen } from './screens/ReviewInquiryScreen';
import { InquirySentScreen } from './screens/InquirySentScreen';
import { MyInquiriesScreen } from './screens/MyInquiriesScreen';
import { InquiryDetailsScreen } from './screens/InquiryDetailsScreen';
import { MyProfileScreen } from './screens/MyProfileScreen';
import { SignInScreen } from './screens/SignInScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { BottomNav } from './components/BottomNav';
import { ContactActionModal } from './components/ContactActionModal';
import { ToastNotification } from './components/ToastNotification';

const AppContent: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'add-vehicle':
        return <AddVehicleScreen />;
      case 'add-parts':
        return <AddSparePartsScreen />;
      case 'contact-details':
        return <ContactDetailsScreen />;
      case 'review-inquiry':
        return <ReviewInquiryScreen />;
      case 'inquiry-sent':
        return <InquirySentScreen />;
      case 'inquiries':
        return <MyInquiriesScreen />;
      case 'inquiry-details':
        return <InquiryDetailsScreen />;
      case 'profile':
      case 'edit-profile':
        return <MyProfileScreen />;
      case 'signin':
        return <SignInScreen />;
      case 'signup':
        return <SignUpScreen />;
      case 'forgot-password':
        return <ForgotPasswordScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#ebeef0] flex justify-center text-[#181c1e] font-sans antialiased selection:bg-[#fb7800]/20 selection:text-[#994700] overflow-x-hidden">
      {/* Mobile-First Shell Container (Center framed on desktop & tablet, full fluid feel on mobile) */}
      <div className="w-full max-w-md min-h-screen bg-[#f7fafc] shadow-[0_0_40px_rgba(0,0,0,0.08)] relative flex flex-col overflow-x-hidden">
        {renderScreen()}
        <BottomNav />
        <ContactActionModal />
        <ToastNotification />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
