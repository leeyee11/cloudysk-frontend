import { useEffect, useState } from 'react';
import { useModel } from '@umijs/max';
import { Input, Select, Modal, Typography } from 'antd';
import { PromptState, PromptTypes } from '@/models/inquiry';

const { Paragraph } = Typography;

const TagInput = (props: any) => {
  return <Select {...props} />;
};

const getValue = (type: PromptTypes, defaultValue?: string) => {
  if (!defaultValue) return undefined;
  return type === PromptTypes.Select ? defaultValue?.split('\n') : defaultValue;
};

const Prompt = ({
  state: { title, description, defaultValue, type, promptOpen, onOk, onCancel },
}: {
  state: PromptState;
}) => {
  const { categories, refresh } = useModel('category');
  const [value, setValue] = useState<string | string[] | undefined>(
    getValue(type, defaultValue),
  );
  useEffect(() => {
    refresh();
    setValue(getValue(type, defaultValue));
  }, [defaultValue]);
  // generate new input everytime
  const timestamp = Date.now();

  return (
    <Modal
      title={title}
      open={promptOpen}
      onOk={() =>
        onOk(
          type === PromptTypes.Select
            ? (value as string[])?.join('\n')
            : (value as string),
        )
      }
      onCancel={() => onCancel()}
    >
      {description ? (
        <Typography>
          <Paragraph>{description}</Paragraph>
        </Typography>
      ) : null}
      {type === PromptTypes.Select ? (
        <TagInput
          mode="tags"
          autoFocus={true}
          style={{ width: '100%' }}
          placeholder="Tags Mode"
          value={value}
          key={timestamp}
          onChange={(v: string[]) => setValue(v)}
          options={categories.map((option) => ({
            label: option,
            value: option,
          }))}
        />
      ) : (
        <Input
          autoFocus={true}
          key={timestamp}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      )}
    </Modal>
  );
};

export default Prompt;
