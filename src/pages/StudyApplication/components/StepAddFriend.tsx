import { searchUser } from "@/apis/users";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SimpleUser, User } from "@/interface/user";
import { Fingerprint, Search, UserPlus, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

const MAX_FRIENDS = 3;

interface StepAddFriendsProps {
  selectedFriends: SimpleUser[];
  onUpdateFriends: (friends: SimpleUser[]) => void;
}

export function StepAddFriends({
  selectedFriends,
  onUpdateFriends,
}: StepAddFriendsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { data: searchResults } = useQuery(
    ["searchUser", debouncedSearchTerm],
    () => searchUser(debouncedSearchTerm)
  );

  const handleAddFriend = (friend: User) => {
    const { email, ...simpleFriendInfo } = friend;
    if (selectedFriends.length < MAX_FRIENDS) {
      onUpdateFriends([...selectedFriends, simpleFriendInfo]);
      setSearchTerm("");
    } else {
      toast.error(`최대 ${MAX_FRIENDS}명의 친구만 추가할 수 있습니다.`);
    }
  };

  const handleRemoveFriend = (friendId: number) => {
    onUpdateFriends(selectedFriends.filter((friend) => friend.id !== friendId));
  };

  const filteredSearchResults = searchResults?.users.filter(
    (friend) =>
      !selectedFriends.some((selectedFriend) => selectedFriend.id === friend.id)
  );

  return (
    <div className="space-y-6">
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-2xl">1단계: 함께할 친구 등록</CardTitle>
        <CardDescription>
          스터디를 함께하고 싶은 친구를 이름, 학번, 이메일로 검색하여 최대{" "}
          {MAX_FRIENDS}명까지 추가하세요.
        </CardDescription>
      </CardHeader>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="친구 이름, 학번, 이메일 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          disabled={selectedFriends.length >= MAX_FRIENDS}
        />
      </div>

      <ScrollArea className="h-[400px] border rounded-md p-1 bg-background relative">
        {filteredSearchResults && filteredSearchResults.length > 0 && (
          <ul className="space-y-2 p-2">
            {filteredSearchResults.map((friend, idx) => (
              <li
                key={friend.sid + "_" + idx}
                className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors"
                onClick={() => handleAddFriend(friend)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {friend.name.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {friend.sid}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={selectedFriends.length >= MAX_FRIENDS}
                >
                  <UserPlus className="h-4 w-4 mr-1" /> 추가
                </Button>
              </li>
            ))}
          </ul>
        )}
        {searchTerm &&
          filteredSearchResults &&
          filteredSearchResults.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-sm text-muted-foreground text-center">
                검색 결과가 없습니다.
              </p>
            </div>
          )}
      </ScrollArea>

      {selectedFriends.length > 0 && (
        <Card className="pt-0">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              선택된 친구 ({selectedFriends.length}/{MAX_FRIENDS})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {selectedFriends.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg shadow-sm cursor-pointer"
                  onClick={() => handleRemoveFriend(friend.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {friend.name.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{friend.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Fingerprint className="h-3 w-3 mr-1" /> {friend.sid}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                  >
                    <XCircle className="" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {selectedFriends.length >= MAX_FRIENDS && (
        <p className="text-sm text-center text-primary font-medium mt-2">
          최대 {MAX_FRIENDS}명의 친구를 모두 선택했습니다.
        </p>
      )}
    </div>
  );
}
