import type { IMessage } from '@rocket.chat/core-typings';
import { Message, MessageLeftContainer, MessageContainer, CheckBox } from '@rocket.chat/fuselage';
import { useToggle } from '@rocket.chat/fuselage-hooks';
import { useUserId } from '@rocket.chat/ui-contexts';
import type { ReactElement } from 'react';
import React, { useRef, memo } from 'react';

import type { MessageActionContext } from '../../../../app/ui-utils/client/lib/MessageAction';
import { useIsMessageHighlight } from '../../../views/room/MessageList/contexts/MessageHighlightContext';
import {
	useIsSelecting,
	useToggleSelect,
	useIsSelectedMessage,
	useCountSelected,
} from '../../../views/room/MessageList/contexts/SelectedMessagesContext';
import { useJumpToMessage } from '../../../views/room/MessageList/hooks/useJumpToMessage';
import { useChat } from '../../../views/room/contexts/ChatContext';
import IgnoredContent from '../IgnoredContent';
import MessageHeader from '../MessageHeader';
import MessageToolboxHolder from '../MessageToolboxHolder';
import StatusIndicators from '../StatusIndicators';
import MessageAvatar from '../header/MessageAvatar';
import RoomMessageContent from './room/RoomMessageContent';
import { useGoToThread } from '/client/views/room/hooks/useGoToThread';

type RoomMessageProps = {
	message: IMessage & { ignored?: boolean };
	showUserAvatar: boolean;
	sequential: boolean;
	unread: boolean;
	mention: boolean;
	all: boolean;
	context?: MessageActionContext;
	ignoredUser?: boolean;
	searchText?: string;
};

const RoomMessage = ({
	message,
	showUserAvatar,
	sequential,
	all,
	mention,
	unread,
	context,
	ignoredUser,
	searchText,
}: RoomMessageProps): ReactElement => {
	const isMacOS = navigator.platform.indexOf('Mac') !== -1;
	const uid = useUserId();
	const editing = useIsMessageHighlight(message._id);
	const [displayIgnoredMessage, toggleDisplayIgnoredMessage] = useToggle(false);
	const ignored = (ignoredUser || message.ignored) && !displayIgnoredMessage;
	const chat = useChat();
	const messageRef = useRef(null);

	const selecting = useIsSelecting();
	const toggleSelected = useToggleSelect(message._id);
	const selected = useIsSelectedMessage(message._id);

	useCountSelected();

	useJumpToMessage(message._id, messageRef);
	const goToThread = useGoToThread();
	const rid = message.rid;
	return (
		<Message
			//onDoubleClick={() => goToThread({ rid, tmid: message._id })}
			style={{cursor: 'default'}}
			ref={messageRef}
			id={message._id}
			onClick={
				(e) => {
					selecting ? toggleSelected : undefined
					if (isMacOS) {
						if (e.metaKey) {
							e.preventDefault();
							e.stopPropagation();
							goToThread({ rid, tmid: message._id })
						};
					}
					else {
						if(e.ctrlKey) {
							e.preventDefault();
							e.stopPropagation();
							goToThread({ rid, tmid: message._id })
						};
					}
				}
			}
			isSelected={selected}
			isEditing={editing}
			isPending={message.temp}
			sequential={sequential}
			data-qa-editing={editing}
			data-qa-selected={selected}
			data-id={message._id}
			data-mid={message._id}
			data-unread={unread}
			data-sequential={sequential}
			data-own={message.u._id === uid}
			data-qa-type='message'
			aria-busy={message.temp}
		>
			<MessageLeftContainer>
				{!sequential && message.u.username && !selecting && showUserAvatar && (
					<MessageAvatar
						emoji={message.emoji}
						avatarUrl={message.avatar}
						username={message.u.username}
						size='x36'
						{...(chat?.userCard && {
							onClick: chat?.userCard.open(message.u.username),
							style: { cursor: 'pointer' },
						})}
					/>
				)}
				{selecting && <CheckBox checked={selected} onChange={toggleSelected} />}
				{sequential && <StatusIndicators message={message} />}
			</MessageLeftContainer>

			<MessageContainer>
				{!sequential && <MessageHeader message={message} />}

				{ignored ? (
					<IgnoredContent onShowMessageIgnored={toggleDisplayIgnoredMessage} />
				) : (
					<RoomMessageContent message={message} unread={unread} mention={mention} all={all} searchText={searchText} />
				)}
			</MessageContainer>
			{!message.private && <MessageToolboxHolder message={message} context={context} />}
		</Message>
	);
};

export default memo(RoomMessage);
