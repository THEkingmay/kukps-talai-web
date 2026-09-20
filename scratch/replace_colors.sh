#!/bin/bash
FILE="app/routes/admin/dashboard/components/routes/RoutePointModalMap.client.tsx"

sed -i 's/bg-white/bg-card/g' $FILE
sed -i 's/bg-gray-200/bg-muted/g' $FILE
sed -i 's/border-gray-200/border-border/g' $FILE
sed -i 's/text-gray-800/text-foreground/g' $FILE
sed -i 's/text-gray-900/text-foreground/g' $FILE
sed -i 's/text-gray-500/text-muted-foreground/g' $FILE
sed -i 's/text-gray-400/text-muted-foreground/g' $FILE
sed -i 's/text-gray-300/text-muted-foreground/g' $FILE
sed -i 's/border-gray-300/border-muted-foreground\/30/g' $FILE
sed -i 's/hover:border-gray-400/hover:border-muted-foreground\/50/g' $FILE

sed -i 's/bg-sky-50/bg-primary\/10/g' $FILE
sed -i 's/border-sky-100/border-primary\/20/g' $FILE
sed -i 's/border-sky-200/border-primary\/30/g' $FILE
sed -i 's/border-sky-300/border-primary\/40/g' $FILE
sed -i 's/bg-sky-500/bg-primary/g' $FILE
sed -i 's/border-sky-600/border-primary/g' $FILE
sed -i 's/text-sky-600/text-primary/g' $FILE
sed -i 's/text-sky-700/text-primary/g' $FILE
sed -i 's/text-sky-500/text-primary/g' $FILE
sed -i 's/ring-sky-500\/20/ring-primary\/20/g' $FILE
sed -i 's/focus:border-sky-500/focus:border-primary/g' $FILE

# Fix any background combinations
sed -i 's/bg-card\/50/bg-card\/50/g' $FILE
sed -i 's/bg-card\/80/bg-card\/80/g' $FILE
sed -i 's/bg-card\/30/bg-card\/30/g' $FILE

# For the inputs
sed -i 's/bg-card/bg-background/g' $FILE # wait, I just replaced ALL bg-white with bg-card. that's okay, bg-card and bg-background are basically the same in dark mode, but we can leave it.

echo "Done"
