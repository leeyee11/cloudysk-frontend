import React, { useRef } from 'react';
import { Input, InputRef, Modal, Typography } from 'antd';
import { PromptState } from '@/models/prompt';

const { Paragraph } = Typography;

const Prompt = ({
  state: { title, description, defaultValue, promptOpen, onOk, onCancel },
}: {
  state: PromptState;
}) => {
  const inputRef = useRef<InputRef>(null);
  // generate new input everytime
  const timestamp = Date.now();

  return (
    <Modal
      title={title}
      open={promptOpen}
      onOk={() => onOk(inputRef.current?.input?.value ?? '')}
      onCancel={() => onCancel()}
    >
      {description ? (
        <Typography>
          <Paragraph>{description}</Paragraph>
        </Typography>
      ) : null}
      <Input
        autoFocus={true}
        key={timestamp}
        ref={inputRef}
        defaultValue={defaultValue}
      />
    </Modal>
  );
};

export default Prompt;
