#!/bin/bash

# Get the number of databases
num_dbs=$(redis-cli CONFIG GET databases | awk 'NR==2')

# Iterate through each database
for db in $(seq 0 $(($num_dbs - 1)))
do
    echo "Database $db:"
    # Use SCAN to safely iterate over keys
    cursor=0
    while
        # Retrieve keys using SCAN
        response=$(redis-cli -n $db SCAN $cursor COUNT 1000)
        # Parse cursor and keys
        cursor=$(echo "$response" | head -n 1)
        keys=$(echo "$response" | tail -n +2)
        
        # Iterate over each key and retrieve its value
        if [[ -n "$keys" ]]; then
            echo "$keys" | while IFS= read -r key; do
              value=$(redis-cli -n $db GET "$key")
              echo "  Key: $key"
              echo "  Value: $value"
            done
        fi

        # Continue until SCAN cursor is zero
        [ "$cursor" != "0" ]
    do :; done
    echo ""
done
