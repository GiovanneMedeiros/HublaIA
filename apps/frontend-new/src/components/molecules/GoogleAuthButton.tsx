'use client';

import { Chrome } from 'lucide-react';
import { Button } from '@/components/atoms';

type GoogleAuthButtonProps = {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
};

export function GoogleAuthButton({ label, onClick, isLoading }: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      fullWidth
      isLoading={isLoading}
      onClick={onClick}
      className="border border-bg-tertiary bg-bg-secondary hover:bg-bg-tertiary"
      icon={<Chrome className="h-4 w-4" />}
    >
      {label}
    </Button>
  );
}