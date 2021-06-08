score = 0
tag_set = {1,2,3,4,5,6,7,8}
s_list = [{1,2},{1,2},{1,2},{1,2},{1,2},{1,2,3}]
null_flg = False
# print(s_list[0]^s_list[1]^s_list[2])
v_list = list(s_list)
firest = v_list.pop(0)
size = set(firest)
b = set(firest)
a = set(firest)
count_a = 0
count_b = 0
bfore = set()
for s in s_list:
  count_a=count_a+len(s)
  count_b=count_b+len(s&bfore)
  bfore = s
  if len(s)==0:
    null_flg = True
for s in v_list:
  b = s^b
  size=size|s
  a = a&s
if null_flg:
  show_size = len(tag_set)
else :
  show_size = size
b=b-a
coeff = 0.9
score = ((len(b)/len(size))/len(show_size))*(coeff**len(s_list))
print(score)
print(count_a)
print(count_b)
print((count_a-count_b)/count_a)*(coeff**len(s_list))
