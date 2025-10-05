import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { Role } from "@/interface/role";
import { useHIStateValue } from "@/hooks/HIState";
import { roleState } from "@/store/HISAtom";
import { useAuth } from "@/hooks/auth";
import { userLogin } from "@/apis/users";

interface RoleInfo {
  label: string;
  color: string;
  sub: string;
}

const ROLE_MAPPER = {
  NONUSER: {
    label: "비로그인",
    color: "bg-gray-500",
    sub: "",
  },
  USER: {
    label: "매칭 안된 유저",
    color: "bg-blue-500",
    sub: "test1",
  },
  MEMBER: {
    label: "스터디원",
    color: "bg-green-500",
    sub: "test2",
  },
  ADMIN: {
    label: "어드민",
    color: "bg-red-500",
    sub: "test3",
  },
} as Record<Role, RoleInfo>;

export function DevRoleSwitcher() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentRole = useHIStateValue(roleState);
  const { login, logout } = useAuth();

  const handleRoleChange = (role: Role) => {
    if (role === "NONUSER") {
      logout();
    } else {
      userLogin(ROLE_MAPPER[role].sub).then((response) => {
        if (response.isRegistered === true) {
          login(
            response.tokens.accessToken,
            response.tokens.refreshToken,
            response.role
          );
        }
      });
    }
  };
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="shadow-lg border-2 border-primary/20">
        {isCollapsed ? (
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2"
              onClick={() => setIsCollapsed(false)}
            >
              <User className="h-4 w-4" />
              <span
                className={`px-2 py-0.5 rounded text-white text-xs font-medium ${ROLE_MAPPER[currentRole].color}`}
              >
                {ROLE_MAPPER[currentRole].label}
              </span>
              <ChevronUp className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dev Role:</span>
                <span
                  className={`px-2 py-0.5 rounded text-white text-xs font-medium ${ROLE_MAPPER[currentRole].color}`}
                >
                  {ROLE_MAPPER[currentRole].label}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsCollapsed(true)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(ROLE_MAPPER) as Role[]).map((role) => (
                  <Button
                    key={role}
                    variant={role === currentRole ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRoleChange(role)}
                  >
                    {ROLE_MAPPER[role].label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
