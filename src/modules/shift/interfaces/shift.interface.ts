import { WEEKDAYS } from '@BE/core/constants';
import { Note } from '@BE/modules/note/note.entity';
import { Task } from '@BE/modules/task/entities';

export interface IShift {
  id?: number;
  startTime?: string;
  endTime?: string;
  repeatDays?: WEEKDAYS[];
  department?: {
    id?: number;
    name?: string;
    address?: string;
  };
  notes?: Note[];
  tasks?: Task[];
}
