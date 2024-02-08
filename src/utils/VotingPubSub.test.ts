import { voting, VotingPubSub } from './VotingPubSub';

describe('VotingPubSub', () => {
  let votingPubSub: VotingPubSub;

  beforeEach(() => {
    votingPubSub = new VotingPubSub();
  });

  it('should subscribe to an event', () => {
    const event = 'vote';
    const listener = jest.fn();

    votingPubSub.subscribe(event, listener);

    expect(votingPubSub['listeners'][event]).toContain(listener);
  });

  it('should emit an event', () => {
    const event = 'vote';
    const listener = jest.fn();
    const message = { pollOptionId: 'option1', votes: 5 };

    votingPubSub.subscribe(event, listener);
    votingPubSub.emit(event, message);

    expect(listener).toHaveBeenCalledWith(message);
  });

  it('should not emit an event if no listeners are subscribed', () => {
    const event = 'vote';
    const listener = jest.fn();
    const message = { pollOptionId: 'option1', votes: 5 };

    votingPubSub.emit(event, message);

    expect(listener).not.toHaveBeenCalled();
  });
});