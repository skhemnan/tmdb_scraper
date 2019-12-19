#!/bin/bash

declare -a dates1
declare -a dates2

for i in {2010..2019}
do
	for j in 01 04 07 10
	do
		dates1+=($i-$j-01)
	done
	for k in 03 06 09 12
	do
		dates2+=($i-$k-31)
	done
done

for ((x=0;x<${#dates1[@]};++x));
do
	node app.js ${dates1[$x]} ${dates2[$x]}	
	mv out.csv "CSV_$x".csv
done



