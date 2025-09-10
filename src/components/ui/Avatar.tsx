import { cva, type VariantProps } from 'class-variance-authority';

const avatarVariants = cva(
  'inline-flex items-center justify-center font-medium text-white rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-sm',
        md: 'h-12 w-12 text-base',
        lg: 'h-16 w-16 text-lg',
        xl: 'h-20 w-20 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  user: {
    name: string;
  };
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getBackgroundColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];
  
  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return colors[hash % colors.length];
}

export function Avatar({ user, size, className }: AvatarProps) {
  const initials = getInitials(user.name);
  const backgroundColor = getBackgroundColor(user.name);

  return (
    <div className={`${avatarVariants({ size, className })} ${backgroundColor}`}>
      {initials}
    </div>
  );
}