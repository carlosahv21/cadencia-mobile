import { RouteProp, NavigationProp } from '@react-navigation/native';
import { DanceClass } from './index'; 

// Definición de parámetros para el Stack principal
export type RootStackParamList = {
    Onboarding: undefined;
    Login: undefined;
    MainTabs: undefined;
    GlobalSearch: undefined;
    ResumeStudent: { student: any };
    ResumenTeacher: { teacher: any };
    ResumeClass: { classData: DanceClass };
    Attendance: { classData: DanceClass };
};

// Definición de parámetros para las Tabs
export type MainTabParamList = {
    Home: undefined;
    Classes: undefined;
    Profile: undefined;
};

/**
 * HELPERS DE TIPADO
 */
export type StackNavigation = NavigationProp<RootStackParamList>;

export type AttendanceRouteProp = RouteProp<RootStackParamList, 'Attendance'>;
export type ResumeClassRouteProp = RouteProp<RootStackParamList, 'ResumeClass'>;
export type ResumeStudentRouteProp = RouteProp<RootStackParamList, 'ResumeStudent'>;
export type ResumenTeacherRouteProp = RouteProp<RootStackParamList, 'ResumenTeacher'>;