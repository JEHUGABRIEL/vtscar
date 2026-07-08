import { ImageOff } from "lucide-react";
import SafeImg from "./SafeImg";
import { FacebookIcon, InstagramIcon, XIcon, LinkedInIcon } from "./SocialIcons";

const socialConfig = [
  { key: "linkedin", Icon: LinkedInIcon, label: "LinkedIn" },
  { key: "facebook", Icon: FacebookIcon, label: "Facebook" },
  { key: "instagram", Icon: InstagramIcon, label: "Instagram" },
  { key: "x", Icon: XIcon, label: "X" },
];

export default function TeamCard({ member }) {
  const socialLinks = member.social || {};
  const hasSocial = socialConfig.some(({ key }) => socialLinks[key]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:lift transition-all duration-300 group">
      <div className="h-72 overflow-hidden">
        <SafeImg
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          icon={ImageOff}
        />
      </div>
      <div className="p-6">
        <h3 className="font-heading font-bold text-lg">{member.name}</h3>
        <p className="text-brand-500 font-semibold text-sm mt-1 mb-3">{member.role}</p>
        {member.description && (
          <p className="text-gray-500 leading-relaxed text-sm">{member.description}</p>
        )}
        {hasSocial && (
          <div className="flex items-center gap-2.5 pt-4 mt-4 border-t border-gray-100">
            {socialConfig.map(({ key, Icon, label }) => {
              const href = socialLinks[key];
              if (!href) return null;
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-200 hover:bg-brand-50/50 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
