import ActivitiesData from './ActivitiesData';
import ActivityTypes from './ActivityTypes';

type ActivityTypeId = typeof ActivityTypes[number]['key'];

interface ActivityDataInterface {
    userEmail: string | null;
    activityTypeId: ActivityTypeId;
    data: ActivitiesData[];
    note: string;
}

export default ActivityDataInterface;