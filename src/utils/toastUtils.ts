import { VariantType, SnackbarOrigin } from 'notistack';

type EnqueueSnackbarType = (
  message: string,
  options?: {
    variant: VariantType;
    autoHideDuration?: number;
    anchorOrigin?: SnackbarOrigin;
    style?: React.CSSProperties;
  }
) => void;

export const showSnackbar = (
  enqueueSnackbar: EnqueueSnackbarType,
  message: string,
  variant: VariantType,
  backgroundColor: string,
  autoHideDuration = 1500,
  anchorOrigin: SnackbarOrigin = { vertical: 'top', horizontal: 'right' }
) => {
  enqueueSnackbar(message, {
    variant,
    autoHideDuration,
    anchorOrigin,
    style: { backgroundColor },
  });
};
