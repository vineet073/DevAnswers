import { Schema, models, model, Document } from 'mongoose';

// create tag interface extends mongoose document
export interface IInteraction extends Document {
  user: Schema.Types.ObjectId; 
  action: string;
  question: Schema.Types.ObjectId; 
  createdAt: Date;
}

const interactionSchema = new Schema<IInteraction>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  createdAt: { type: Date, default: Date.now }
});

const Interaction = models?.Interaction || model('Interaction', interactionSchema);

export default Interaction;
