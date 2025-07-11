import ActivityTypes from '../constants/ActivityTypes';
import ActivitiesData from './ActivitiesData';

type ActivityTypeId = typeof ActivityTypes[number]['key'];

interface ActivityDataInterface {
    userEmail: string | null;
    activityTypeId: ActivityTypeId;
    data: ActivitiesData[];
    note: string;
}

export default ActivityDataInterface;