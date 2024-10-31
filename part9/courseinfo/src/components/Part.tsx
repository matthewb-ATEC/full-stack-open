import CoursePart from '../types';
import assertNever from '../utils';

interface PartProps {
  part: CoursePart;
}

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case 'basic':
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <div>
            <em>{part.description}</em>
          </div>
          <br />
        </div>
      );
    case 'group':
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <div>project exercises {part.groupProjectCount}</div>
          <br />
        </div>
      );
    case 'background':
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <div>submit to {part.backgroundMaterial}</div>
          <br />
        </div>
      );
    case 'special':
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <div>
            <em>{part.description}</em>
          </div>
          <div>required skills: {part.requirements.join(', ')}</div>
          <br />
        </div>
      );
    default:
      assertNever(part);
  }
};

export default Part;
