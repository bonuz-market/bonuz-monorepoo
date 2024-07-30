import { AddNewChallenge, I_AddNewChallenge } from './AddNewChallenge';

interface ChallengesListProps {
  challenges: I_AddNewChallenge[];
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedChallenge: I_AddNewChallenge) => void;
  handleOnDrop: (files: File[]) => void;
}

export const AddNewChallengesList: React.FC<ChallengesListProps> = ({
  challenges,
  onDelete,
  onEdit,
  handleOnDrop
}) => (
  <div>
    {challenges.map((challenge, index) => (
      <AddNewChallenge
        index={index}
        key={challenge.challengeId}
        challenge={challenge}
        onDelete={onDelete}
        onEdit={onEdit}
        handleOnDrop={handleOnDrop}
      />
    ))}
  </div>
);
