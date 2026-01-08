BASENAME=$(basename ${1})

# Remove header
tail -n +45 ${1} > all_words_${BASENAME}

# Filter to:
# 5-letter words
# No apostrophes
cat all_words_${BASENAME} \
    | grep -P '^.{5}$' \
    | grep -v "'" \
    > filtered_words_${BASENAME}