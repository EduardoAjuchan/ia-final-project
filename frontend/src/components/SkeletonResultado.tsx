


'use client';

import { Box, Skeleton, Card, CardContent } from '@mui/material';

export default function SkeletonResultado() {
  return (
    <Card className="max-w-md mx-auto mt-6">
      <CardContent>
        <Skeleton variant="rectangular" width="100%" height={200} className="rounded mb-4" />

        <Box className="space-y-3">
          <Skeleton variant="text" width="60%" height={30} />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="text" width="80%" height={24} />
          ))}

          <Skeleton variant="text" width="60%" height={30} />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i + 5} variant="text" width="80%" height={24} />
          ))}

          <Skeleton variant="text" width="60%" height={30} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i + 10} variant="text" width="80%" height={24} />
          ))}

          <Skeleton variant="text" width="60%" height={30} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i + 13} variant="text" width="80%" height={24} />
          ))}

          <Skeleton variant="text" width="60%" height={30} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i + 16} variant="text" width="80%" height={24} />
          ))}

          <Skeleton variant="rectangular" width="100%" height={40} className="mt-4 rounded" />
        </Box>
      </CardContent>
    </Card>
  );
}